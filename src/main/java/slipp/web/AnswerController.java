package slipp.web;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import slipp.model.Answer;
import slipp.model.AnswerRepository;
import slipp.model.Question;
import slipp.model.QuestionRepository;
import slipp.model.Result;
import slipp.model.User;
import slipp.utils.HttpSessionUtils;

@RestController
@RequestMapping("/api/questions/{questionId}/answers")
public class AnswerController {
	
	@Autowired
	private QuestionRepository questionRepository;
	@Autowired
	private AnswerRepository answerRepository;
	
	@PostMapping("")
	public Answer create(@PathVariable Long questionId, String contents, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return new Answer();
		}
		
		User loginUser = HttpSessionUtils.getUserFromSession(session);
		Question question = questionRepository.findOne(questionId);
		Answer answer = new Answer(loginUser, question, contents);
		//answerRepository.save(answer);
		return answerRepository.save(answer);
	}
	
	@DeleteMapping("/{id}")
	public Result delete(@PathVariable Long questionId, @PathVariable Long id, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return Result.fail("로그인 하세요.");
		}
		User loginUser = HttpSessionUtils.getUserFromSession(session);
		Answer answer = answerRepository.findOne(id);
		if (!answer.isSameWriter(loginUser)) {
			return Result.fail("자신의 글만 삭제할 수 있습니다.");
		}
		answer.delete(loginUser);
		answerRepository.save(answer);
		return Result.ok();
	}
}
